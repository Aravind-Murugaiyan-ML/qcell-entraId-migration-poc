package com.geli.geni.site.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.geli.geni.site.IntegrationTest;
import com.geli.geni.site.domain.Sitefalse;
import com.geli.geni.site.domain.enumeration.SiteStatus;
import com.geli.geni.site.repository.SiteRepository;
import com.geli.geni.site.service.dto.SiteDTO;
import com.geli.geni.site.service.mapper.SiteMapper;
import jakarta.persistence.EntityManager;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link SiteResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class SiteResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_LOCATION = "AAAAAAAAAA";
    private static final String UPDATED_LOCATION = "BBBBBBBBBB";

    private static final Double DEFAULT_CAPACITY = 1D;
    private static final Double UPDATED_CAPACITY = 2D;

    private static final SiteStatus DEFAULT_STATUS = SiteStatus.ONLINE;
    private static final SiteStatus UPDATED_STATUS = SiteStatus.OFFLINE;

    private static final Instant DEFAULT_CREATED_AT = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_CREATED_AT = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final Instant DEFAULT_UPDATED_AT = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_UPDATED_AT = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final String ENTITY_API_URL = "/api/sites";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private SiteRepository siteRepository;

    @Autowired
    private SiteMapper siteMapper;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restSiteMockMvc;

    private Sitefalse sitefalse;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Sitefalse createEntity(EntityManager em) {
        Sitefalse sitefalse = new Sitefalse()
            .name(DEFAULT_NAME)
            .location(DEFAULT_LOCATION)
            .capacity(DEFAULT_CAPACITY)
            .status(DEFAULT_STATUS)
            .createdAt(DEFAULT_CREATED_AT)
            .updatedAt(DEFAULT_UPDATED_AT);
        return sitefalse;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Sitefalse createUpdatedEntity(EntityManager em) {
        Sitefalse sitefalse = new Sitefalse()
            .name(UPDATED_NAME)
            .location(UPDATED_LOCATION)
            .capacity(UPDATED_CAPACITY)
            .status(UPDATED_STATUS)
            .createdAt(UPDATED_CREATED_AT)
            .updatedAt(UPDATED_UPDATED_AT);
        return sitefalse;
    }

    @BeforeEach
    public void initTest() {
        sitefalse = createEntity(em);
    }

    @Test
    @Transactional
    void createSite() throws Exception {
        int databaseSizeBeforeCreate = siteRepository.findAll().size();
        // Create the Site
        SiteDTO siteDTO = siteMapper.toDto(sitefalse);
        restSiteMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(siteDTO))
            )
            .andExpect(status().isCreated());

        // Validate the Site in the database
        List<Sitefalse> siteList = siteRepository.findAll();
        assertThat(siteList).hasSize(databaseSizeBeforeCreate + 1);
        Sitefalse testSite = siteList.get(siteList.size() - 1);
        assertThat(testSite.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testSite.getLocation()).isEqualTo(DEFAULT_LOCATION);
        assertThat(testSite.getCapacity()).isEqualTo(DEFAULT_CAPACITY);
        assertThat(testSite.getStatus()).isEqualTo(DEFAULT_STATUS);
        assertThat(testSite.getCreatedAt()).isEqualTo(DEFAULT_CREATED_AT);
        assertThat(testSite.getUpdatedAt()).isEqualTo(DEFAULT_UPDATED_AT);
    }

    @Test
    @Transactional
    void createSiteWithExistingId() throws Exception {
        // Create the Site with an existing ID
        sitefalse.setId(1L);
        SiteDTO siteDTO = siteMapper.toDto(sitefalse);

        int databaseSizeBeforeCreate = siteRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restSiteMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(siteDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Site in the database
        List<Sitefalse> siteList = siteRepository.findAll();
        assertThat(siteList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = siteRepository.findAll().size();
        // set the field null
        sitefalse.setName(null);

        // Create the Site, which fails.
        SiteDTO siteDTO = siteMapper.toDto(sitefalse);

        restSiteMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(siteDTO))
            )
            .andExpect(status().isBadRequest());

        List<Sitefalse> siteList = siteRepository.findAll();
        assertThat(siteList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllSites() throws Exception {
        // Initialize the database
        siteRepository.saveAndFlush(sitefalse);

        // Get all the siteList
        restSiteMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(sitefalse.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].location").value(hasItem(DEFAULT_LOCATION)))
            .andExpect(jsonPath("$.[*].capacity").value(hasItem(DEFAULT_CAPACITY.doubleValue())))
            .andExpect(jsonPath("$.[*].status").value(hasItem(DEFAULT_STATUS.toString())))
            .andExpect(jsonPath("$.[*].createdAt").value(hasItem(DEFAULT_CREATED_AT.toString())))
            .andExpect(jsonPath("$.[*].updatedAt").value(hasItem(DEFAULT_UPDATED_AT.toString())));
    }

    @Test
    @Transactional
    void getSite() throws Exception {
        // Initialize the database
        siteRepository.saveAndFlush(sitefalse);

        // Get the site
        restSiteMockMvc
            .perform(get(ENTITY_API_URL_ID, sitefalse.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(sitefalse.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.location").value(DEFAULT_LOCATION))
            .andExpect(jsonPath("$.capacity").value(DEFAULT_CAPACITY.doubleValue()))
            .andExpect(jsonPath("$.status").value(DEFAULT_STATUS.toString()))
            .andExpect(jsonPath("$.createdAt").value(DEFAULT_CREATED_AT.toString()))
            .andExpect(jsonPath("$.updatedAt").value(DEFAULT_UPDATED_AT.toString()));
    }

    @Test
    @Transactional
    void getNonExistingSite() throws Exception {
        // Get the site
        restSiteMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingSite() throws Exception {
        // Initialize the database
        siteRepository.saveAndFlush(sitefalse);

        int databaseSizeBeforeUpdate = siteRepository.findAll().size();

        // Update the site
        Sitefalse updatedSitefalse = siteRepository.findById(sitefalse.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedSitefalse are not directly saved in db
        em.detach(updatedSitefalse);
        updatedSitefalse
            .name(UPDATED_NAME)
            .location(UPDATED_LOCATION)
            .capacity(UPDATED_CAPACITY)
            .status(UPDATED_STATUS)
            .createdAt(UPDATED_CREATED_AT)
            .updatedAt(UPDATED_UPDATED_AT);
        SiteDTO siteDTO = siteMapper.toDto(updatedSitefalse);

        restSiteMockMvc
            .perform(
                put(ENTITY_API_URL_ID, siteDTO.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(siteDTO))
            )
            .andExpect(status().isOk());

        // Validate the Site in the database
        List<Sitefalse> siteList = siteRepository.findAll();
        assertThat(siteList).hasSize(databaseSizeBeforeUpdate);
        Sitefalse testSite = siteList.get(siteList.size() - 1);
        assertThat(testSite.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testSite.getLocation()).isEqualTo(UPDATED_LOCATION);
        assertThat(testSite.getCapacity()).isEqualTo(UPDATED_CAPACITY);
        assertThat(testSite.getStatus()).isEqualTo(UPDATED_STATUS);
        assertThat(testSite.getCreatedAt()).isEqualTo(UPDATED_CREATED_AT);
        assertThat(testSite.getUpdatedAt()).isEqualTo(UPDATED_UPDATED_AT);
    }

    @Test
    @Transactional
    void putNonExistingSite() throws Exception {
        int databaseSizeBeforeUpdate = siteRepository.findAll().size();
        sitefalse.setId(longCount.incrementAndGet());

        // Create the Site
        SiteDTO siteDTO = siteMapper.toDto(sitefalse);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restSiteMockMvc
            .perform(
                put(ENTITY_API_URL_ID, siteDTO.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(siteDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Site in the database
        List<Sitefalse> siteList = siteRepository.findAll();
        assertThat(siteList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchSite() throws Exception {
        int databaseSizeBeforeUpdate = siteRepository.findAll().size();
        sitefalse.setId(longCount.incrementAndGet());

        // Create the Site
        SiteDTO siteDTO = siteMapper.toDto(sitefalse);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSiteMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(siteDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Site in the database
        List<Sitefalse> siteList = siteRepository.findAll();
        assertThat(siteList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamSite() throws Exception {
        int databaseSizeBeforeUpdate = siteRepository.findAll().size();
        sitefalse.setId(longCount.incrementAndGet());

        // Create the Site
        SiteDTO siteDTO = siteMapper.toDto(sitefalse);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSiteMockMvc
            .perform(
                put(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(siteDTO))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Site in the database
        List<Sitefalse> siteList = siteRepository.findAll();
        assertThat(siteList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateSiteWithPatch() throws Exception {
        // Initialize the database
        siteRepository.saveAndFlush(sitefalse);

        int databaseSizeBeforeUpdate = siteRepository.findAll().size();

        // Update the site using partial update
        Sitefalse partialUpdatedSitefalse = new Sitefalse();
        partialUpdatedSitefalse.setId(sitefalse.getId());

        partialUpdatedSitefalse.location(UPDATED_LOCATION).capacity(UPDATED_CAPACITY).status(UPDATED_STATUS);

        restSiteMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedSitefalse.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedSitefalse))
            )
            .andExpect(status().isOk());

        // Validate the Site in the database
        List<Sitefalse> siteList = siteRepository.findAll();
        assertThat(siteList).hasSize(databaseSizeBeforeUpdate);
        Sitefalse testSite = siteList.get(siteList.size() - 1);
        assertThat(testSite.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testSite.getLocation()).isEqualTo(UPDATED_LOCATION);
        assertThat(testSite.getCapacity()).isEqualTo(UPDATED_CAPACITY);
        assertThat(testSite.getStatus()).isEqualTo(UPDATED_STATUS);
        assertThat(testSite.getCreatedAt()).isEqualTo(DEFAULT_CREATED_AT);
        assertThat(testSite.getUpdatedAt()).isEqualTo(DEFAULT_UPDATED_AT);
    }

    @Test
    @Transactional
    void fullUpdateSiteWithPatch() throws Exception {
        // Initialize the database
        siteRepository.saveAndFlush(sitefalse);

        int databaseSizeBeforeUpdate = siteRepository.findAll().size();

        // Update the site using partial update
        Sitefalse partialUpdatedSitefalse = new Sitefalse();
        partialUpdatedSitefalse.setId(sitefalse.getId());

        partialUpdatedSitefalse
            .name(UPDATED_NAME)
            .location(UPDATED_LOCATION)
            .capacity(UPDATED_CAPACITY)
            .status(UPDATED_STATUS)
            .createdAt(UPDATED_CREATED_AT)
            .updatedAt(UPDATED_UPDATED_AT);

        restSiteMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedSitefalse.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedSitefalse))
            )
            .andExpect(status().isOk());

        // Validate the Site in the database
        List<Sitefalse> siteList = siteRepository.findAll();
        assertThat(siteList).hasSize(databaseSizeBeforeUpdate);
        Sitefalse testSite = siteList.get(siteList.size() - 1);
        assertThat(testSite.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testSite.getLocation()).isEqualTo(UPDATED_LOCATION);
        assertThat(testSite.getCapacity()).isEqualTo(UPDATED_CAPACITY);
        assertThat(testSite.getStatus()).isEqualTo(UPDATED_STATUS);
        assertThat(testSite.getCreatedAt()).isEqualTo(UPDATED_CREATED_AT);
        assertThat(testSite.getUpdatedAt()).isEqualTo(UPDATED_UPDATED_AT);
    }

    @Test
    @Transactional
    void patchNonExistingSite() throws Exception {
        int databaseSizeBeforeUpdate = siteRepository.findAll().size();
        sitefalse.setId(longCount.incrementAndGet());

        // Create the Site
        SiteDTO siteDTO = siteMapper.toDto(sitefalse);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restSiteMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, siteDTO.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(siteDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Site in the database
        List<Sitefalse> siteList = siteRepository.findAll();
        assertThat(siteList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchSite() throws Exception {
        int databaseSizeBeforeUpdate = siteRepository.findAll().size();
        sitefalse.setId(longCount.incrementAndGet());

        // Create the Site
        SiteDTO siteDTO = siteMapper.toDto(sitefalse);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSiteMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(siteDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Site in the database
        List<Sitefalse> siteList = siteRepository.findAll();
        assertThat(siteList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamSite() throws Exception {
        int databaseSizeBeforeUpdate = siteRepository.findAll().size();
        sitefalse.setId(longCount.incrementAndGet());

        // Create the Site
        SiteDTO siteDTO = siteMapper.toDto(sitefalse);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSiteMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(siteDTO))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Site in the database
        List<Sitefalse> siteList = siteRepository.findAll();
        assertThat(siteList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteSite() throws Exception {
        // Initialize the database
        siteRepository.saveAndFlush(sitefalse);

        int databaseSizeBeforeDelete = siteRepository.findAll().size();

        // Delete the site
        restSiteMockMvc
            .perform(delete(ENTITY_API_URL_ID, sitefalse.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Sitefalse> siteList = siteRepository.findAll();
        assertThat(siteList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
